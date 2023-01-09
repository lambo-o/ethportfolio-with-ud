import React, {useEffect, useState} from "react";
import {Box, Container, Grid, Typography} from "@mui/material";
import type {Holding, User} from "../../types";
import {calcOverallDiffs, toUSD} from "../../utils";
import {PriceDiffs, TokenHolding} from "..";

type Props = {
    user: User;
};

export default function Profile(props: Props) {
    const {user} = props;
    const wallet_address = user?.wallet_address;

    const [holdings, setHoldings] = useState<any[]>([]);

    useEffect(() => {
        if (wallet_address) {
            (async () => {
                try {
                    const response = await fetch(
                        `https://api.ethplorer.io/getAddressInfo/${wallet_address}?apiKey=${process.env.REACT_APP_KEY_ETHPLORER}`
                    );
                    const data = await response.json();

                    const ethHolding: Holding = {
                        address: "0",
                        name: "Ethereum",
                        symbol: "ETH",
                        balance: data.ETH.balance,
                        image: "/images/eth.png",
                        rate: data.ETH.price.rate,
                        value: data.ETH.balance * data.ETH.price.rate,
                        diff: data.ETH.price.diff,
                        diff7d: data.ETH.price.diff7d,
                        diff30d: data.ETH.price.diff30d,
                    };

                    const holdings: any =
                        data.tokens?.length > 0
                            ? data.tokens
                                .filter((token: any) => parseInt(token.tokenInfo.decimals) > 0) // Filter out non ERC-20 tokens
                                .map((token: any) => {
                                    const {
                                        address,
                                        name,
                                        symbol,
                                        image,
                                        decimals,
                                        price: {rate, diff, diff7d, diff30d},
                                    } = token.tokenInfo;

                                    const balance = token.balance * Math.pow(10, +decimals * -1);

                                    return {
                                        address,
                                        name,
                                        symbol,
                                        balance,
                                        image,
                                        rate,
                                        value: balance * rate,
                                        diff,
                                        diff7d,
                                        diff30d,
                                    };
                                })
                            : []
                    const sortedHoldings = holdings.sort((a:any,b:any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0) )
                    return setHoldings([ethHolding, ...sortedHoldings]);
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }, [wallet_address]);

    const {diff, diff7d, diff30d} = holdings && calcOverallDiffs(holdings);

    return (

        <Container sx={{marginTop: 12, paddingBottom: 12}}>
            <Typography variant="h3" align="center" gutterBottom>
                <b>My portfolio</b>
            </Typography>
            <Box
                sx={{display: "flex", flexDirection: "column", alignItems: "center"}}
            >
                <Typography variant="h4" align="center" gutterBottom color="green">
                    <b>Total Value:</b> {" ~"}
                    {toUSD(holdings.reduce((acc, curr) => acc + (curr.value ? curr.value : 0), 0))}
                </Typography>
                <Box
                    sx={{
                        width: 300,
                        marginBottom: 4,
                    }}
                >
                    <PriceDiffs diff={diff} diff7d={diff7d} diff30d={diff30d}/>
                </Box>
            </Box>
            <Grid container spacing={3}>
                {holdings &&
                    holdings.map((holding: any, index) => {
                        return (
                            <Grid item xs={12} sm={6} md={6} key={index}>
                                <TokenHolding {...holding} />
                            </Grid>
                        );
                    })}
            </Grid>
        </Container>
    );
}
