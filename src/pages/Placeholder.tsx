import { Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Placeholder({
  title,
  comingSoon = false,
}: {
  title: string;
  comingSoon?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          {comingSoon && (
            <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
              <Lock className="size-5 text-slate-400" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">
            {comingSoon
              ? 'This feature is planned but not available yet.'
              : 'This screen is being built.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
