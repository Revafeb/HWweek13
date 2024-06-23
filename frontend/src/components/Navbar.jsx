import { useEffect, useState } from "react";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Avatar,
    Text,
    useDisclosure,
    useToast,
    VStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Switch,
    useColorMode,
    flexbox,
    Box
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../modules/fetch";

const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState("");
    const { toggleColorMode } = useColorMode();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token) {
            setIsLogin(true);
        }
    }, [window.localStorage.getItem("token")]);

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token && isLogin) {
            fetchUserInfo(token);
        }
    }, [isLogin]);

    const fetchUserInfo = async (token) => {
        try {
            const response = await fetch("/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch user information");
            }
            const data = await response.json();
            setUserName(data.userName);
        } catch (error) {
            console.error("Error fetching user information:", error);
        }
    };

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        setIsLogin(false);
        setUserName("");
        navigate("/");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const token = await loginUser(
                e.target.email.value,
                e.target.password.value
            );
            if (!token.token) {
                throw new Error("Invalid token received");
            }
            window.localStorage.setItem("token", token.token);
            setIsLogin(true);
            toast({
                title: "Login",
                description: "Login Success",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } catch (err) {
            console.error("Login error:", err);
            toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex
            w="full"
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1rem"
            bg="blue.500"
            color="white"
        >
            <Link to="/">
                <Flex salign="center" mr={5} cursor="pointer">
                    <Text fontSize="xl" fontWeight="bold" textColor="white">
                        My Book
                    </Text>
                </Flex>
            </Link>
            <HStack>
                {isLogin && (
                    <Link to="/newbook">
                        <Button colorScheme="teal">Create New Book</Button>
                    </Link>
                )}
                {!isLogin ? (
                    <Button onClick={onOpen} colorScheme="teal">
                        Login
                    </Button>
                ) : (
                    <Menu>
                        <Flex align="center">
                            <Switch
                                id="darkModeSwitch"
                                onChange={toggleColorMode}
                                colorScheme="teal"
                                size="md"
                            />
                        </Flex>
                        <MenuButton as={Flex}
                            align="center"
                            cursor="pointer"
                            p={2}
                            borderRadius="md"
                            _hover={{}}
                            _expanded={{ bg: 'blue.400' }}
                            _focus={{ boxShadow: "outline" }}
                        >
                            <Avatar size="sm" name={userName} />
                            <Text ml={2}>{userName}</Text>
                        </MenuButton>
                        <MenuList >
                            <MenuItem
                                as={Flex}
                                onClick={handleLogout}
                                cursor={"pointer"}
                                _hover={{ bg: 'white' }}
                                textColor={"grey"}
                            >
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                )}
            </HStack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <form
                    id="login-form"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        handleLogin(e);
                    }}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Login</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" form="login-form" colorScheme="teal" mr={3}>
                                Login
                            </Button>
                            <Link to="/register" onClick={onClose}>
                                <Button variant="ghost">
                                    Doesn't Have Account? Click here
                                </Button>
                            </Link>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </Flex>
    );
};

export default Navbar;