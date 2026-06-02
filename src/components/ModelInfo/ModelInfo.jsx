import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import "./ModelInfo.css";
import ModelViewer from "../ModelViewer/ModelViewer";

export default function ModelInfo({
  handleCloseModal,
  product,
  handleAddCart
}) {

  const navigate = useNavigate();

  console.log(product);
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
                    <label className="titleInfoModel">{product.name}</label>
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
                        <label className="price">${product.price}</label>
                        <button className="checkout-btn">[ Add to Cart ]</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
