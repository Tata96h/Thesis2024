import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fichiers } = req.query;
  const filePath = path.join(process.cwd(), 'soutenance', 'files', fichiers as string);

  // Vérifiez si le fichier existe
  if (fs.existsSync(filePath)) {
    // Déterminez le type MIME
    const ext = path.extname(filePath).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Définissez les en-têtes appropriés
    res.setHeader('Content-Disposition', `inline; filename="${fichiers}"`);
    res.setHeader('Content-Type', contentType);

    // Envoyez le fichier
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
}