import ModelViewer from "../ModelViewer/ModelViewer";
import "./ProductCard.css";

export default function ProductCard({ product, onClick }) {
  const { name, artist, price, modelUrl, image } = product;
  const priceLabel = price === 0 ? "Free" : `$${price.toFixed(2)}`;

  return (
    <article className="productCard" onClick={onClick}>
      <div className="productImageWrap">
        {modelUrl ? (
          <ModelViewer src={modelUrl} />
        ) : (
          <img src={image} alt={name} className="productImage" />
        )}
      </div>
      <div className="productInfo">
        <h3 className="productName">{name}</h3>
        <p className="productArtist">{artist}</p>
        <span className="productPrice">{priceLabel}</span>
      </div>
    </article>
  );
}