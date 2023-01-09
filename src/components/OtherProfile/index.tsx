import React, {useState} from "react";
import {Alert, Box, Button, Container, Grid, TextField, Typography} from "@mui/material";
import type {Holding} from "../../types";
import {calcOverallDiffs, toUSD} from "../../utils";
import {PriceDiffs, TokenHolding} from "..";


export default function OtherProfile() {
    const [inputAddress, setInputAddress] = useState<any>('');
    const [loading, setLoading] = useState<any>(false);
    const [error, setError] = useState<any>(null);
    const [holdings, setHoldings] = useState<any[]>([]);

    const fetchData = async (address: any) => {
        setLoading(true)
        try {
            const response = await fetch(
                `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=${process.env.REACT_APP_KEY_ETHPLORER}`
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
            setLoading(false)
            setError(null)
            return setHoldings([ethHolding, ...sortedHoldings]);
        } catch (error) {
            console.error(error);
            setError(error)
        }
    }

    const {diff, diff7d, diff30d} = holdings && calcOverallDiffs(holdings);

    const handleCheckAddress = async (address: any) => {
        setLoading(true);
        setError(null);
        if (!address.trim()) {
            setLoading(false);
            return setError('Input wallet !');
        }

        const regEx = /^0x([A-Fa-f0-9]{40})$/;
        if (!regEx.test(address.trim())) {
            setLoading(false);
            return setError('Incorrect wallet address !');
        }
        await fetchData(address)
    };

    return (
        <Container sx={{marginTop: 12, paddingBottom: 12}}>
            <Typography variant="h4" align="center" gutterBottom>
                <b>Check portfolio by address</b>
            </Typography>

            <center>
                <Box sx={{}}>
                    <TextField id="outlined-basic" label="ETH address" sx={{width: "500px"}} variant="outlined"
                               onChange={(e) => {
                                   setInputAddress(e.target.value)
                               }}/>
                </Box>
                <Box sx={{marginTop: "20px"}}>
                    <Button sx={{}} variant="contained" color="warning" onClick={() => {
                        handleCheckAddress(inputAddress)
                    }}>
                        Get data
                    </Button>
                </Box>

                <Box sx={{marginTop: "20px"}}>
                    {loading && <div>Waiting...</div>}
                </Box>

                <Box sx={{marginTop: "20px", width: "500px"}}>
                    {
                        error && <Alert severity="error"><b>Error:</b> {error}</Alert>
                    }
                </Box>
            </center>
            {
                !loading && !error && holdings.length !== 0 &&
                <>
                    <Box
                        sx={{display: "flex", flexDirection: "column", alignItems: "center"}}
                    >
                        <Typography variant="h4" align="center" gutterBottom color="green">
                            <b>Total Value:</b> {" ~"}
                            {toUSD(holdings.reduce((acc, curr) => acc + (curr.value ? curr.value : 0), 0))}
                        </Typography>
                        <Box sx={{width: 300,marginBottom: 4,}}>
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
                </>
            }
        </Container>
    );
}