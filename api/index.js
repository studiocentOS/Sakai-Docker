// Importazione del modulo Express per creare e gestire il server web
const express = require('express');

// Importazione del modulo CORS per abilitare le richieste cross-origin
const cors = require('cors');

// Importazione del modulo Mongoose per interagire con MongoDB
const mongoose = require('mongoose');

// Importazione del modello 'Note' per interagire con la collezione 'notes' in MongoDB
const Note = require('./Note');

// Creazione di un'istanza dell'applicazione Express
const app = express();

// Configurazione dell'applicazione Express per utilizzare CORS
app.use(cors());

// Configurazione dell'applicazione Express per analizzare il corpo delle richieste JSON
app.use(express.json());

// Connessione al database MongoDB utilizzando l'URL fornito dalle variabili d'ambiente
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // Opzione per il parsing dell'URL del database
    useUnifiedTopology: true // Opzione per utilizzare il nuovo sistema di gestione della topologia del server
}).then(() => {
    console.log('Connected to MongoDB'); // Messaggio di log in caso di connessione riuscita
}).catch((err) => {
    console.log(err); // Messaggio di log in caso di errore di connessione
});

// Definizione dell'endpoint GET per recuperare tutte le note
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find(); // Recupero di tutte le note dal database
        res.status(200).json({ message: "Fetched notes successfully", data: notes }); // Invio delle note al client con stato 200
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" }); // Invio di un messaggio di errore con stato 500 in caso di fallimento
    }
});

// Definizione dell'endpoint POST per creare una nuova nota
app.post('/api/notes', async (req, res) => {
    try {
        const newNote = new Note({ // Creazione di un nuovo oggetto nota
            title: req.body.title, // Assegnazione del titolo dalla richiesta
            content: req.body.content // Assegnazione del contenuto dalla richiesta
        });
        const savedNote = await newNote.save(); // Salvataggio della nuova nota nel database
        res.status(201).json({ message: "Note created successfully", data: savedNote }); // Invio di una risposta di successo con stato 201
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" }); // Invio di un messaggio di errore con stato 500 in caso di fallimento
    }
});

// Definizione di un gestore per tutte le altre rotte non specificate
app.all('*', (req, res) => {
    res.status(404).json({ message: "Route not found" }); // Invio di un messaggio di errore con stato 404 per rotte non trovate
});

// Avvio del server sulla porta 4000
app.listen(4000, () => {
    console.log('Server is running on port 4000'); // Messaggio di log che indica l'avvio del server
});
