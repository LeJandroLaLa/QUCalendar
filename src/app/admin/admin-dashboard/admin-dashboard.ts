import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

interface PendingItem {
  id: string;
  type: 'event' | 'venue' | 'artist';
  name: string;
  status: string;
  createdAt: any;
  avatarEmoji?: string;
  date?: string;
  venueName?: string;
  city?: string;
  state?: string;
  venueType?: string;
  basedIn?: string;
  performanceTypes?: { icon: string; label: string }[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  pendingVenues = signal<PendingItem[]>([]);
  pendingArtists = signal<PendingItem[]>([]);
  pendingEvents = signal<PendingItem[]>([]);
  approvedVenues = signal<PendingItem[]>([]);
  approvedArtists = signal<PendingItem[]>([]);
  approvedEvents = signal<PendingItem[]>([]);

  activeTab = signal<'pending' | 'approved'>('pending');
  actionMessage = signal('');
  private subscriptions: Subscription[] = [];

  constructor(
    private firestore: Firestore,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCollection('venues', this.pendingVenues, this.approvedVenues);
    this.loadCollection('artists', this.pendingArtists, this.approvedArtists);
    this.loadCollection('events', this.pendingEvents, this.approvedEvents);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadCollection(
    collectionName: string,
    pendingSignal: ReturnType<typeof signal<PendingItem[]>>,
    approvedSignal: ReturnType<typeof signal<PendingItem[]>>
  ): void {
    const ref = collection(this.firestore, collectionName);

    const pendingSub = collectionData(
      query(ref, where('status', '==', 'pending'), orderBy('createdAt', 'desc')),
      { idField: 'id' }
    ).subscribe(items => {
      pendingSignal.set(items as PendingItem[]);
    });

    const approvedSub = collectionData(
      query(ref, where('status', '==', 'approved'), orderBy('createdAt', 'desc')),
      { idField: 'id' }
    ).subscribe(items => {
      approvedSignal.set(items as PendingItem[]);
    });

    this.subscriptions.push(pendingSub, approvedSub);
  }

  async approve(item: PendingItem): Promise<void> {
    try {
      const collectionName = item.type === 'event' ? 'events' :
                             item.type === 'venue' ? 'venues' : 'artists';
      await updateDoc(doc(this.firestore, collectionName, item.id), {
        status: 'approved'
      });
      this.showMessage(`✅ ${item.name} approved!`);
    } catch (err) {
      console.error('Error approving:', err);
      this.showMessage('❌ Error approving item.');
    }
  }

  async reject(item: PendingItem): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) return;
    try {
      const collectionName = item.type === 'event' ? 'events' :
                             item.type === 'venue' ? 'venues' : 'artists';
      await deleteDoc(doc(this.firestore, collectionName, item.id));
      this.showMessage(`🗑️ ${item.name} deleted.`);
    } catch (err) {
      console.error('Error rejecting:', err);
      this.showMessage('❌ Error deleting item.');
    }
  }

  async unapprove(item: PendingItem): Promise<void> {
    try {
      const collectionName = item.type === 'event' ? 'events' :
                             item.type === 'venue' ? 'venues' : 'artists';
      await updateDoc(doc(this.firestore, collectionName, item.id), {
        status: 'pending'
      });
      this.showMessage(`↩️ ${item.name} moved back to pending.`);
    } catch (err) {
      console.error('Error unapproving:', err);
      this.showMessage('❌ Error updating item.');
    }
  }

  private showMessage(msg: string): void {
    this.actionMessage.set(msg);
    setTimeout(() => this.actionMessage.set(''), 3000);
  }

  getTotalPending(): number {
    return this.pendingVenues().length +
           this.pendingArtists().length +
           this.pendingEvents().length;
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getItemSubtitle(item: PendingItem): string {
   if (item.type === 'event') return `${item.date ?? ''} • ${item.venueName ?? ''}`;
   if (item.type === 'venue') return `${item.city ?? ''}, ${item.state ?? ''} • ${item.venueType ?? ''}`;
   if (item.type === 'artist') return `${item.basedIn ?? ''} • ${item.performanceTypes?.map(p => p.label).join(', ') ?? ''}`;
   return '';
  }
}