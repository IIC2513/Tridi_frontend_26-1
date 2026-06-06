import { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import "./CardView.css";

export default function CardView({
  card,
  onSelect
}) {
  
  const navigate = useNavigate();

  return (
    <div className="cardTridi" onClick={onSelect}>
        <div className="cardTridi__info">
            <div className="cardTridi__logo">TridiCard</div>
            <div className="cardTridi__chip">
                <svg className="cardTridi__chip-lines" role="img" width="20px" height="20px" viewBox="0 0 100 100" aria-label="Chip">
                    <g opacity="0.8">
                        <polyline points="0,50 35,50" fill="none" stroke="#000" strokeWidth="2"></polyline>
                        <polyline points="0,20 20,20 35,35" fill="none" stroke="#000" strokeWidth="2"></polyline>
                        <polyline points="50,0 50,35" fill="none" stroke="#000" strokeWidth="2"></polyline>
                        <polyline points="65,35 80,20 100,20" fill="none" stroke="#000" strokeWidth="2"></polyline>
                        <polyline points="100,50 65,50" fill="none" stroke="#000" strokeWidth="2"></polyline>
                        <polyline points="35,35 65,35 65,65 35,65 35,35" fill="none" stroke="#000" strokeWidth="2"></polyline>
                        <polyline points="0,80 20,80 35,65" fill="none" stroke="#000" strokeWidth="2"></polyline>
                        <polyline points="50,100 50,65" fill="none" stroke="#000" strokeWidth="2"></polyline>
                        <polyline points="65,65 80,80 100,80" fill="none" stroke="#000" strokeWidth="2"></polyline>
                    </g>
                </svg>
                <div className="cardTridi__chip-texture"></div>
            </div>
            <div className="cardTridi__type">debit</div>
            <div className="cardTridi__number">
                <span className="cardTridi__digit-group">XXXX</span>
                <span className="cardTridi__digit-group">XXXX</span>
                <span className="cardTridi__digit-group">XXXX</span>
                <span className="cardTridi__digit-group">{card.last4}</span>
            </div>
            <div className="cardTridi__valid-thru" aria-label="Valid thru">Valid thru</div>
            <div className="cardTridi__exp-date">{card.expMonth}/{card.expYear}</div>
            <div className="cardTridi__name" aria-label="Dee Stroyer">{card.brand}</div>
            </div>
        <div className="cardTridi__texture"></div>
    </div>
    );
}
