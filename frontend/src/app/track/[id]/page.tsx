import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TrackByIdPage({ params }: PageProps) {
  redirect(`/track?id=${params.id}`);
}

