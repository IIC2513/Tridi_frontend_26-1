import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "./useAuth";

const CardContext = createContext();

function toCard(card) {
  return {
    id: card.id,
    brand: card.brand,
    last4: card.last4,
    expMonth: card.expMonth,
    expYear: card.expYear,
    createdAt: card.createdAt,
  };
}

export function CardProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refreshCards() {
    if (!isAuthenticated) {
      setCards([]);
      return;
    }

    try {
      setLoading(true);

      const { data } = await client.get("/cards");

      setCards(data.data.map(toCard));
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addCard(cardData) {
    await client.post("/cards", cardData);

    await refreshCards();
  }

  async function removeCard(cardId) {
    await client.delete(`/cards/${cardId}`);

    await refreshCards();
  }

  useEffect(() => {
    refreshCards();
  }, [isAuthenticated]);

  return (
    <CardContext.Provider
      value={{
        cards,
        loading,
        refreshCards,
        addCard,
        removeCard,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

export function useCards() {
  return useContext(CardContext);
}