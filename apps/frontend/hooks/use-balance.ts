import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useBalance = (): {
  balance: number;
  loading: boolean;
  error: boolean;
} => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  useEffect(() => {
    async function getBalance() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND}/v1/user/balance/${userId}`
        );

        if (response.status == 200) {
          const balance = response.data.balance;
          console.log(response.data.message);
          setBalance(balance);
        }
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    }
    getBalance();
  }, [userId]);

  return {
    balance,
    loading,
    error,
  };
};
