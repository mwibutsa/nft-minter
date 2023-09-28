import { Card, Flex, Box, Text } from "@radix-ui/themes";
import { useAccount } from "wagmi";

type UserTokenProps = {
  data: Array<any>;
  isLoading?: boolean;
};

const UserTokens: React.FC<UserTokenProps> = ({ data, isLoading = false }) => {
  const account = useAccount();

  if (!account.isConnected) {
    return "Your wallet is not connected.";
  }

  if (!isLoading && data.length === 0) {
    return "Use the form below to mint some tokens";
  }

  return (
    <div className="user-tokens">
      {isLoading && data.length < 0
        ? "Loading..."
        : data.map((token) => {
            return (
              <div className="mb-2">
                <a
                  href={`https://${String(
                    process.env.NEXT_PUBLIC_DEFAULT_CHAIN
                  ).replace("eth-", "")}.etherscan.io/nft/${
                    token.contract.address
                  }/${token.tokenId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Card size="2">
                    <Flex>
                      <Flex
                        align="center"
                        justify="center"
                        style={{ height: "100%", borderRadius: "100%" }}
                        pr="2"
                      >
                        <img
                          src={token.rawMetadata.image}
                          alt="Token image"
                          width={70}
                          height={70}
                          className="rounded-full border-2"
                          style={{ width: 70, height: 70 }}
                        />
                      </Flex>

                      <Box style={{ maxWidth: 400 }}>
                        <Text as="div" color="gray" mb="1" size="4">
                          {token.rawMetadata.name} #{token.tokenId}
                        </Text>
                        <Text size="5">{token.description}</Text>
                        <Text color="blue" as="div" size="5">
                          Balance: {token.balance}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </a>
              </div>
            );
          })}
    </div>
  );
};

export default UserTokens;
