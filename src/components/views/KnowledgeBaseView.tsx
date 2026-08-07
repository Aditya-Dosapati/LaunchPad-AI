'use client';

import React, { useState } from 'react';
import { useApp, Document } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../ui/Table';
import { TableSkeleton } from '../ui/Skeletons';
import { ErrorState } from '../ui/ErrorState';
import { Toast } from '../ui/Toast';
import { 
  BookOpen, 
  Search, 
  Database, 
  Cpu, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  Layers
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { documents, demoState, setDemoState, role } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (demoState === 'loading') {
    return <TableSkeleton rows={4} />;
  }

  if (demoState === 'error') {
    return <ErrorState onRetry={() => setDemoState('normal')} />;
  }

  const handleReindexVectors = () => {
    setToastMsg('Triggered full vector re-indexing for 1,240 documents with text-embedding-3-large model.');
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-fade-in widescreen-container pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            Knowledge Engine & Vector Index Management
            <Database size={16} className="text-orange-500" />
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
            Monitor document versions, approval status, vector embeddings, Pinecone index health, and storage utilization.
          </p>
        </div>

        <button
          onClick={handleReindexVectors}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
        >
          <RefreshCw size={13} />
          Trigger Vector Re-index
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Indexed Documents</p>
          <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-1">1,240 Docs</p>
          <p className="text-[10.5px] font-semibold text-zinc-400 mt-1">100% Vectorized</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Embedding Model</p>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">text-embedding-3</p>
          <p className="text-[10.5px] font-semibold text-emerald-500 mt-1">3,072 Dimensions</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pinecone Vector Index</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">p2.x8 Cluster</p>
          <p className="text-[10.5px] font-semibold text-zinc-400 mt-1">Latency: 14ms</p>
        </Card>

        <Card variant="secondary">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Storage Allocation</p>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">1.2 TB / 5 TB</p>
          <p className="text-[10.5px] font-semibold text-zinc-400 mt-1">AWS S3 Multi-Region</p>
        </Card>
      </div>

      {/* Controls: Search */}
      <div className="relative group max-w-md w-full">
        <Search size={13} className="absolute left-3 top-2.5 text-zinc-400" />
        <input
          type="text"
          placeholder="Search document index by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs font-semibold pl-9 pr-4 py-2 bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800 focus:border-orange-500/20 rounded-xl text-zinc-800 dark:text-zinc-200 outline-none shadow-xs"
        />
      </div>

      {/* Document Index Table */}
      <div className="border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Vector Embedding</TableHead>
              <TableHead>Approval Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{doc.title}</TableCell>
                <TableCell className="text-xs font-bold text-zinc-500">{doc.category}</TableCell>
                <TableCell className="text-xs font-semibold text-zinc-400">{doc.version || 'v1.0'}</TableCell>
                <TableCell className="text-xs font-semibold text-zinc-500">{doc.author}</TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    🟢 Synced (3,072d)
                  </span>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded text-[8.5px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {doc.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}
    </div>
  );
};
