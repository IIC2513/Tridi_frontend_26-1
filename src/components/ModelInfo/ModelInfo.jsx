import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import "./ModelInfo.css";
import ModelViewer from "../ModelViewer/ModelViewer";
import { useCart } from "../../context/CartContext";

export default function ModelInfo({
  handleCloseModal,
  product,
  handleAddCart,
  setFlash
}) {

  const navigate = useNavigate();
  const {addToCart} = useCart();

  const handleAdd = async () => {
    handleCloseModal();
    await addToCart(product.id);
    setFlash({
        type: "success",
        title: "Added to cart",
        message: `${product.name} added successfully.`
    });
  };

  return (
    <div className="ModalBlackArea" onClick={handleCloseModal}>
        <div className="containerModelFull" onClick={(e) => e.stopPropagation()}>
            <div className="modelSection">
                <ModelViewer
                    src={product.modelUrl}
                    alt={product.name}
                />
            </div>
            <div className="containerInfoModel" onClick={(e) => e.stopPropagation()}>
                <div className="cardInfoModel cartInfo">
                    <div className="titleInfoModel">{product.name}</div>
                    <div className="steps">
                        <div className="step">
                            <div>
                                <span>MODEL DETAILS</span>
                                <p>Description: {product.description}</p>
                                <p>Published: {new Date(product.createdAt).toLocaleDateString()}</p>
                            </div>
                            <hr className="hrModel"/>
                            <div>
                                <span>CREATOR</span>
                                <div className="creatorInfo">
                                <p>{product.artist}</p>
                                <button className="artist-btn" onClick={() => navigate(`/users/${product.artist}`)}>[ View Artist ]</button>
                                </div>
                            </div>
                            <hr className="hrModel"/>
                            <div>
                                <span>TAGS</span>
                                <div className="tagsContainer">
                                    {product.tags?.map((tag) => (
                                        <span key={tag} className="tagPill">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <hr className="hrModel"/>
                            <div>
                                <span>FILES</span>
                                {product.files?.map((file) => (
                                    <p key={file.id}>
                                        • {file.extension.toUpperCase()} — {file.size} MB
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cardInfoModel checkout">
                    <div className="footer">
                        <label className="price">${(product.price).toFixed(2)}</label>
                        <button className="checkout-btn" onClick={handleAdd}>[ Add to Cart ]</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
