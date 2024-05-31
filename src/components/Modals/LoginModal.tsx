import React from "react";
import { Modal, Input, Button, Row, Col, Flex } from "antd";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { apis } from "apis"
import { useSelector } from "react-redux";
import store, { RootState } from "store";
import { setOpenLoginModal } from "store/slices/appSlice";
import { Auth } from "types";

interface Props {
	handleLoggedIn: (auth: Auth) => void;
}

const LoginModal = ({handleLoggedIn}: Props) => {
    const [email, setEmail] = React.useState("");
    const { openLoginModal } = useSelector((state: RootState) => state.appKey);

    const { signMessageAsync } = useSignMessage()
    const { address, isConnected } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect();

    const [tryLogin, setTryLogin] = React.useState(false);

    const handleSignMessage = async ({
		publicAddress,
		nonce,
	}: {
		publicAddress: string;
		nonce: string;
	}) => {
		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore because web3 is defined here.
			if (!publicAddress) {
				throw new Error(
					'There is issue: address or chain is missing.'
				);
			} else {
				const message = `I am signing my one-time nonce: ${nonce}`;

				const signature = await signMessageAsync({ message })

				return { publicAddress, signature };
			}
		} catch (err) {
			debugger
			throw new Error(
				'You need to sign the message to be able to log in.'
			);
		}
	};

    const handleAuthenticate = ({
		publicAddress,
		signature,
	}: {
		publicAddress: string;
		signature: `0x${string}`;
	}) =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
			body: JSON.stringify({ publicAddress, signature }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then((response) => response.json());

    const loginWithEmail = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${email}`)
            .then((response) => response.json())
            // If yes, retrieve it. If no, create it.
            .then((users) =>
                users.length ? users[0] : handleSignup(email)
            )
            .then(handleSendMail);
    }

    const handleSignup = (publicAddress: string) =>
        fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            body: JSON.stringify({ publicAddress }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST'
        }).then((response) => response.json());

    const handleSendMail = async ({
        publicAddress,
        nonce
    }: {
        publicAddress: string;
        nonce: string;
    }) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/email/send`, {
            body: JSON.stringify({ publicAddress, nonce }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })
            .then((response) => {
                debugger
                if (response.status != 200) {
                    throw new Error('withdraw failed')

                } else {
                    return response.json()
                }
            })
            .catch(err => {
                debugger
                console.error(err)
            });
    };

    React.useEffect(() => {
        if (address && isConnected && tryLogin) {
            setTryLogin(false);
            apis.GetUser(address)
                .then((users: any) =>
                    users.length ? users[0] : handleSignup(address)
                )
                .then(handleSignMessage)
                // Send signature to backend on the /auth route
                .then(handleAuthenticate)
                // Pass accessToken back to parent component (to save it in localStorage)
                .then(handleLoggedIn)
                .catch((err) => {
                    window.alert(err);
                    disconnect();
                });

        }
    }, [address, isConnected, tryLogin]);

    return (
        <Modal
            open={openLoginModal}
            title="Login To Speak"
            footer={null}
            zIndex={50}
            onCancel={() => { store.dispatch(setOpenLoginModal(false)) }}
        >
            <Flex vertical justify="space-around" style={{ height: 200 }}>
                <Input
                    id="filled-search"
                    placeholder="Email"
                    style={{ height: 50 }}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <Button type='text' onClick={loginWithEmail} >Login with Email</Button>
                <Row style={{ justifyContent: 'space-between' }}>
                    {connectors.map((connector: any) => {
                        if (connector.type == "injected")
                            return null
                        else return (
                            <Col>
                                <Button
                                    key={connector.uid}
                                    onClick={() => connect({ connector }, {
                                        onSuccess: () => {
                                            setTryLogin(true);
                                        }
                                    })}
                                    type="primary"
                                >
                                    {connector.name}
                                </Button>
                            </Col>
                        )
                    })}
                </Row>
            </Flex>
        </Modal>
    )
}

export default LoginModal;