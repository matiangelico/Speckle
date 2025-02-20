const path = require('path');
const fs = require('fs').promises;

const formatMatrixToTxt = (matrix) => {
    return matrix.map(row => row.join('\t')).join('\n');
};
  
const formatMatrixToCsv = (matrix) => {
    return matrix.map(row => row.join(',')).join('\n');
};


exports.downloadMatrix = async (req, res) => {
    try {

        console.log("Entre al metodo descargando matriz");
        const { type, method, format } = req.query;
        const userId = req.auth.payload.sub;

        if (!['descriptor', 'clustering'].includes(type) || !method || !['txt', 'csv'].includes(format)) {
          return res.status(400).json({ error: "Parámetros inválidos" });
        }
    
        const sanitizedUserId = userId.replace(/\|/g, '_'); // Reemplaza '|' por '_'
        const userDir = path.join(__dirname, '..', '..', 'uploads', 'temp', sanitizedUserId);
        const filename = type === 'descriptor' 
            ? 'matrices_descriptores.json' 
            : 'matricesClustering.json';

        const filePath = path.join(userDir, filename);
    
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
    
        const result = jsonData.find(item => 
          type === 'descriptor' 
            ? item.nombre_descriptor === method 
            : item.nombre_clustering === method
        );
    
        if (!result) {
          return res.status(404).json({ error: "Método no encontrado" });
        }
    
        const matrix = type === 'descriptor' 
          ? result.matriz_descriptor 
          : result.matriz_clustering;
    
        const formatted = format === 'txt' 
          ? formatMatrixToTxt(matrix)
          : formatMatrixToCsv(matrix);
    
        res.setHeader('Content-Type', 'text/plain');
        res.attachment(`${method}_${Date.now()}.${format}`);
        res.send(formatted);
    
    } catch (error) {
        console.error('Error en descarga:', error);
        
        if (error.code === 'ENOENT') {
          return res.status(404).json({ error: "Recurso no encontrado" });
        }
        
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
};
