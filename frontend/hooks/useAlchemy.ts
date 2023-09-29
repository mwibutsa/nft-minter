import alchemy from "@/lib/alchemy";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useGetUserTokens = () => {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Array<any>>([]);

  const fetchTokens = useCallback(async () => {
    try {
      const result = await alchemy.nft.getNftsForOwner(
        String(account.address),
        {
          contractAddresses: [String(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)],
        }
      );
      setData(result.ownedNfts);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [account?.address]);

  useEffect(() => {
    if (account.isConnected) {
      fetchTokens();
    }
  }, [account?.isConnected]);

  return {
    isLoading,
    error,
    data,
    fetchTokens,
  };
};
