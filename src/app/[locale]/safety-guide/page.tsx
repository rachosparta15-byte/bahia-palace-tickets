import { permanentRedirect } from 'next/navigation';

export default function SafetyGuideRedirect() {
  permanentRedirect('/safety');
}
