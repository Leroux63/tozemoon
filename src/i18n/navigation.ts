import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Helpers typés basés sur TON routing (avec /projects et /projects/[slug])
export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname
} = createNavigation(routing);
