import React from "react";
import { Modal, Input, Button, Row, Col } from "antd";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { apis } from "apis"
import { useSelector } from "react-redux";
import store, { RootState } from "store";
import { setOpenLoginModal } from "store/slices/appSlice";

const LoginModal = () => {
    const [email, setEmail] = React.useState("");
    const { openLoginModal } = useSelector((state: RootState) => state.appKey);

    const { signMessageAsync } = useSignMessage()
    const { address, isConnected } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect();

    const [tryLogin, setTryLogin] = React.useState(false);

    const handleSignMessage = () => {

    }

    const handleAuthenticate = () => {

    }

    const handleLoggedIn = () => {

    }

    const handleSignUp = (address: string) => {

    }

    React.useEffect(() => {
        if (address && isConnected && tryLogin) {
            setTryLogin(false);
            apis.GetUser(address)
                .then((users: any) =>
                    users.length ? users[0] : handleSignUp(address)
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
            footer={null}
            zIndex={50}
            onCancel={() => { store.dispatch(setOpenLoginModal(false)) }}
        >
            <Input placeholder="Email" />
            <Row>
                {connectors.map((connector: any) => {
                    if (connector.type == "injected")
                        return null
                    else return (
                        <Col span={8}>
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
        </Modal>
    )
}

export default LoginModal;