import { useRef } from "react";
import ModelViewer from "../ModelViewer/ModelViewer";
import "./ProductCard.css";

const DRAG_THRESHOLD = 6;

export default function ProductCard({ product, onClick, handleCloseModal }) {
  const { name, artist, price, modelUrl, image } = product;
  const priceLabel = price === 0 ? "Free" : `$${price.toFixed(2)}`;
  const downPos = useRef(null);

  const handlePointerDown = (e) => {
    downPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    if (!downPos.current) return;
    const dx = e.clientX - downPos.current.x;
    const dy = e.clientY - downPos.current.y;
    const moved = Math.hypot(dx, dy);
    downPos.current = null;
    if (moved < DRAG_THRESHOLD) {
      onClick?.();
    }
  };

  const handlePointerCancel = () => {
    downPos.current = null;
  };

  return (
    <article
      className="productCard"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className="productImageWrap">
        {modelUrl ? (
          <ModelViewer src={modelUrl} />
        ) : (
          <img src={image} alt={name} className="productImage" />
        )}
      </div>
      <div className="productData">
        <div className="productInfo">
            <h3 className="productName">{name}</h3>
            <p className="productArtist">{artist}</p>
            <span className="productPrice">{priceLabel}</span>
        </div>
        <div className="productInfo">
            <button className="buttonDetails" onClick={() => handleCloseModal(product)}>
                <span className="text">View Details</span>
            </button>
        </div>
      </div>
    </article>
  );
}