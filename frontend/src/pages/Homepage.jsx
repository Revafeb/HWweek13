import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Books from "../components/Books";
import { getAllBooks } from "../modules/fetch";

function Homepage() {
    const [books, setBooks] = useState("");
    useEffect(() => {
        const fetchBooks = async () => {
            const books = await getAllBooks()
            setBooks(books);
        };
        fetchBooks();
    }, []);

    return (
        <Grid
            templateColumns="repeat(4, 1fr)"
            gap={6}
            w="98%"
            h="10"
        >
            {books?.books?.map((book) => (
                <Books key={`${book.id} ${book.title}`} {...book} />
            ))}
        </Grid>
    )
}

export default Homepage; 