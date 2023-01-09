import React, {useEffect, useState} from "react";
import uauth from "./uauth";
import {AppBar, Box, Button, IconButton, LinearProgress, Toolbar, Typography,} from "@mui/material";
import type {User} from "./types";
// @ts-ignore
import UnstopableDomainsLogo from "./images/unstoppabledomains.png"

import {Home, OtherProfile, Profile} from "./components";

function MenuIcon() {
    return null;
}

export default function App() {
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [error, setError] = useState<any>(null);
    const [portfolioPage, setPortfolioPage] = useState<any>('my');

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const user = await uauth?.user();
                setUser(user);
                setError(5325);
            } catch (error: any) {
                setError(error.message);
            }
            return setLoading(false);
        })();
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await uauth?.loginWithPopup();
            const user = await uauth?.user();
            setUser(user);
        } catch (error: any) {
            setError(error.message);
        }
        setLoading(false);
        return window.location.reload();
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await uauth?.logout();
            setUser(undefined);
        } catch (error: any) {
            setError(error.message);
        }
        setLoading(false);
        return window.location.reload();
    };

    const renderContent = () => {
        if (loading) {
            return <LinearProgress/>;
        }

        if (user && portfolioPage === 'my') {
            return <Profile user={user}/>;
        }

        if (portfolioPage === 'other') {
            return <OtherProfile/>;
        }

        return <Home/>;
    };


    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">

                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            ETH Portfolio
                        </Typography>

                        <Button sx={{marginRight: "10px"}} variant="contained" color="warning" onClick={() => {
                            setPortfolioPage('other')
                        }}>
                            Check portfolio
                        </Button>

                        {user ? (
                            <>
                                <Button sx={{marginRight: "10px"}} variant="contained" color="secondary"
                                        onClick={() => {
                                            setPortfolioPage('my')
                                        }}>
                                    My portfolio
                                </Button>
                                <Button variant="contained" color="success" sx={{marginRight: "10px", textTransform: "inherit"}}>
                                    <img
                                        alt=""
                                        draggable="false"
                                        src={UnstopableDomainsLogo}
                                        style={{height: 20, marginRight: 10}}
                                    />
                                    {user.sub}
                                    {" [" + user.wallet_address?.substring(0, 10)
                                        + "..."
                                        + user.wallet_address?.substring(user.wallet_address?.length - 10)
                                        + "]"
                                    }
                                </Button>
                                <Button variant="contained" color="error" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" color="success" onClick={handleLogin}>
                                <img
                                    alt="unstoppable-login-button"
                                    draggable="false"
                                    src={UnstopableDomainsLogo}
                                    style={{height: 20, marginRight: 10}}
                                />
                                Login with Unstoppable
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
            {renderContent()}
        </>
    );
}
