import {
  Heading,
  Container,
  Flex,
  TextField,
  Box,
  Text,
  Button,
} from "@radix-ui/themes";
import "./page.scss";
import { useRouter } from "next/router";
import { FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log({ email, password });
  }

  return (
    <Container size="2" className="pageContainer">
      <form onSubmit={handleSubmit} className="loginForm">
        <Heading size={"5"}>Sign In</Heading>

        <Box>
          <Text>Email</Text>
          <TextField.Root
            name="email"
            type="email"
            placeholder="Enter your email"
          ></TextField.Root>
        </Box>

        <Box>
          <Text>Password</Text>
          <TextField.Root
            type="password"
            name="password"
            placeholder="Enter your password"
          ></TextField.Root>
        </Box>

        <Flex justify={"end"}>
          <Button size="2">Sign In</Button>
        </Flex>
      </form>
    </Container>
  );
}
