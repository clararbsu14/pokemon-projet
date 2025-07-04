import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import Header from "../../components/Header/Header";
import Footer from "../../components/Others/Footer";
import PokeStats from "../../components/Pokemon/PokeStats";
import PokeCard from "../../components/Pokemon/PokeCard";

import api from "../../services/api";

function Details({ history, ...props }) {
  const { id } = props.match.params;

  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    async function loadPokemon() {
      try {
        const response = await api.get(`/pokemon/${id}`);
        if (response.status === 200) {
          setPokemon(response.data);
        } else {
          throw new Error("Not found");
        }
      } catch (error) {
        history.push("/");
      } finally {
        setLoading(false);
      }
    }

    if (!id) {
      history.push("/");
    } else {
      window.scrollTo(0, 0);
      loadPokemon();
    }
  }, [id, history]);

  return (
    <div>
      <Header />
      <Container fluid className="text-light mb-4">
        {loading ? (
          <p>Loading...</p>
        ) : pokemon ? (
          <Row>
            <Col xs={12} md={6}>
              <PokeCard
                name={pokemon.name_fr}
                id={pokemon.id}
                image={pokemon.image}
                types={pokemon.types}
                click={false}
              />
            </Col>
            <Col xs={12} md={6}>
              <PokeStats stats={pokemon} />
            </Col>
          </Row>
        ) : (
          <p>Pokemon not found.</p>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default Details;
