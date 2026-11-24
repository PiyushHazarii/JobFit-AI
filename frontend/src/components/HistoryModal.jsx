import React from "react";
import { History, X, Calendar, FileText, CheckCircle } from "lucide-react";

export default function HistoryModal({ isOpen, onClose, records, onSelectRecord }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="card-title-group">
            <History size={20} className="text-primary" />
            <h3 className="modal-title">Analysis History (SQLite Stored)</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {records && records.length > 0 ? (
            <div className="history-list">
              {records.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => {
                    onSelectRecord(item);
                    onClose();
                  }}
                >
                  <div className="history-info">
                    <div className="history-filename">
                      <FileText size={16} className="text-primary" />
                      <strong>{item.filename}</strong>
                    </div>
                    <div className="history-meta">
                      <Calendar size={12} />
                      <span>{item.created_at}</span>
                    </div>
                  </div>
                  <div className="history-score">
                    <span className="history-score-number">{item.score} / 10</span>
                    <span className="history-badge">
                      {item.analysis?.verdict || "Evaluated"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No stored analyses found yet. Run an analysis to store it in SQLite.</p>
          )}
        </div>
      </div>
    </div>
  );
}
