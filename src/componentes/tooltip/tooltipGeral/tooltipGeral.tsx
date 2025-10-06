import React from 'react';
import { Tooltip } from 'antd';

interface TooltipVariacaoProps {
  children: React.ReactNode;
  texto: string;
}

const TooltipGeral: React.FC<TooltipVariacaoProps> = ({ children, texto }) => {
  return (
    <Tooltip 
      title={
        <div style={{ fontSize: 12, lineHeight: '1.4em', backgroundColor: '#ffffff', padding: '8px', borderRadius: '4px' }}>
            <div>{texto}</div>
          {/* <div><strong>Variação:</strong></div>
          <div>• Verde: Melhoria no desempenho</div>
          <div>• Vermelho: Queda no desempenho</div>
          <div>• Cinza: Sem alteração</div> */}
        </div>
      }
      placement="top"
      overlayStyle={{ maxWidth: 300 }}
      color='#595959'    >
      {children}
    </Tooltip>
  );
};

export default TooltipGeral;