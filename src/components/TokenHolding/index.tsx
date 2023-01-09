import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
} from "@mui/material";
import type { Holding } from "../../types";
import { PriceDiffs } from "..";
import { toUSD } from "../../utils";
// @ts-ignore
import noImage from "../../images/no-image.png"

export default function TokenHolding(props: Holding) {
  const {
    address,
    name,
    symbol,
    balance,
    image,
    rate,
    value,
    diff,
    diff7d,
    diff30d,
  } = props;

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "20px",
        minHeight: 260,
        borderRadius: "40px",
        bgcolor: "#cfeef1"
      }}
      elevation={10}
    >
      <CardMedia
        component="img"
        sx={{background: "#888", minWidth: 100, minHeight: 100, maxWidth: 100, maxHeight: 100,borderRadius: "10px", border: "2px solid black" }}
        image={image ? `https://ethplorer.io/${image}`: noImage}
      />
      <Box
        sx={{
          display: "flex",
          margin: "auto",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5" noWrap={true}>
            <a target="_blank" style={{color: "inherit"}} href={address !== "0" ? `https://etherscan.io/token/${address}` : "#"}><b>{name}</b></a>
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Typography
              variant="subtitle1"
              color="text.secondary"
              noWrap={true}
            >
              Price: {toUSD(rate)}
            </Typography>

          </Box>
          <Typography
            component="div"
            variant="h6"
            color="text.secondary"
            noWrap={true}
          >
            <b>Balance:</b> {balance?.toFixed(2) } {symbol}
          </Typography>
          <Typography
            component="div"
            variant="h5"
            color="green"
            noWrap={true}
            gutterBottom
          >
            <b>Value:</b> ~{toUSD(value)}
          </Typography>
          {rate && <PriceDiffs diff={diff ? diff : "nan"} diff7d={diff7d ? diff7d : "nan" } diff30d={diff30d? diff30d : "nan"} />}
        </CardContent>
      </Box>
    </Card>
  );
}
