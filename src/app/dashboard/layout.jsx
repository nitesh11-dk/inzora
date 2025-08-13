import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";
import { getWalletFromToken } from "./actions"; // Make sure it accepts token or userId

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const user = token ? await getUserFromToken(token) : null;

  let wallet = null;
  if (user) {
    try {
      wallet = await getWalletFromToken(); 
      // Pass token or user.id based on your getWalletFromToken implementation
    } catch (error) {
      console.log("Error fetching wallet:", error);
    }
  }


  return (
    <div >
      <Navbar
        isLoggedIn={!!user}
        wallet={wallet}
       >
      {children}
        </Navbar>

    </div>
  );
}
