import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let signedIn = false;
  if (supabaseConfigured()) {
    const sb = await createClient();
    const { data } = await sb.auth.getUser();
    signedIn = Boolean(data.user);
  }
  return (
    <>
      <Navbar signedIn={signedIn} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
