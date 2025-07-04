import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import Header from "../../components/Header/Header";
import PokeCard from "../../components/Pokemon/PokeCard";
import Search from "../../components/Others/Search";
import LoadingCard from "../../components/Loading/LoadingCard";
import Footer from "../../components/Others/Footer";
import api from "../../services/api";
import Colors from "../../styles/Colors";

let pokemonsOriginal = [];
const perPage = 16;
let max = 0;

function Home({ history, ...props }) {
  const { query } = props.match.params;
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);

  function HandlerResult(maximum, pokemons) {
    max = maximum;
    setPokemons(pokemons);
  }

  const LoadPokemons = useCallback(async () => {
    try {
      const response = await api.get('/pokemon');  // Ton backend NestJS

      const all = response.data.map((poke) => ({
        name: poke.name_fr || poke.name,  // Prend name_fr si dispo sinon name
        id: poke.id,
        types: poke.type ? [poke.type.name] : [],
        number: poke.id.toString().padStart(3, "0"),
        image: poke.image
      }));

      pokemonsOriginal = all;
      HandlerResult(all.length, all);
    } catch (error) {
      console.error("Erreur lors du chargement des pokémons :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    LoadPokemons();
  }, [LoadPokemons]);

  useEffect(() => {
    if (!pokemonsOriginal.length) return;

    setLoading(true);
    if (!query) {
      HandlerResult(pokemonsOriginal.length, pokemonsOriginal.slice(0, perPage));
    } else {
      const filterPokemons = pokemonsOriginal.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.number.includes(query)
      );
      HandlerResult(filterPokemons.length, filterPokemons.slice(0, perPage));
    }
    setLoading(false);
  }, [query]);

  function LoadMore() {
    const limitCount = pokemons.length + perPage;
    if (!query) {
      setPokemons(pokemonsOriginal.slice(0, limitCount));
    } else {
      const filterPokemons = pokemonsOriginal.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.number.includes(query)
      );
      setPokemons(filterPokemons.slice(0, limitCount));
    }
  }

  return (
    <div>
      <Header />
      <Container fluid>
        <Search history={history} query={query} />
        {loading ? (
          <LoadingCard qty={12} />
        ) : (
          <InfiniteScroll
            style={{ overflow: "none" }}
            dataLength={pokemons.length}
            next={LoadMore}
            hasMore={pokemons.length < max}
            loader={
              <div className="mb-4 d-flex justify-content-center align-item-center">
                <Spinner
                  style={{ color: Colors.card_gray }}
                  animation="border"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            }
            endMessage={
              <p className="text-light" style={{ textAlign: "center" }}>
                <b>Pokémon : Attrapez-les tous !</b>
              </p>
            }
          >
            <Row>
              {pokemons.map((item) => (
                <Col key={item.id} xs={12} sm={6} lg={3}>
                  <PokeCard
                    name={item.name}
                    id={item.id}
                    types={item.types}
                    click={true}
                    image={item.image}
                  />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default Home;
