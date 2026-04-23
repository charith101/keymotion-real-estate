"use client";

import { FileText, Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import type { PropertyDocument } from '@/lib/types';
import Link from 'next/link';

interface PropertyDocumentsProps {
  documents: PropertyDocument[];
}

export function PropertyDocuments({ documents }: PropertyDocumentsProps) {
  const { isAuthenticated } = useAuth();

  if (documents.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold">Documents</h2>
      <div className="mt-4 space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{doc.name}</span>
            </div>
            {doc.isPublic || isAuthenticated ? (
              <Button variant="outline" size="sm" asChild>
                <a href={doc.url} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <Lock className="mr-2 h-4 w-4" />
                  Login to Download
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
