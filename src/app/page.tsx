import { Button } from "@styles/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>SLO Beaver Brigade</h1>
      <Button>Nice Button</Button>
      <Link href="/login">Test Login</Link>
    </main>
  );
}
