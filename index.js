// Hier wird die Prozentzahl unter dem Prozentslider aktualisiert, der Slider Value wird überprüft und dann ausgegeben
document.getElementById('fortschritt').addEventListener('input', function () {
    document.getElementById('fortschrittWert').textContent = this.value + '%';
});

// Das gleiche wie oben einfach für das Bearbeitungsformular
document.getElementById('editFortschritt').addEventListener('input', function () {
    document.getElementById('editFortschrittWert').textContent = this.value + '%';
});

// Das Formular kann hier dann submitted werden, wenn die Formularvalidierung erfolgreich ist
document.getElementById('todoForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seitenneuladen)
    if (formValidieren()) { 
        aufgabeHinzufuegen(); 
    }
});

// Das Suchfeld schaut auf den Input, der der User macht, dieser wird mit der aufgabeSuchen Funktion dann abgerufen
document.getElementById('suche').addEventListener('input', function () {
    aufgabenSuchen(this.value); // Ruft die Suchfunktion auf, wenn der User etwas eintippt
});

// Speicherung der Eingabedaten in einem Array
let aufgaben = []; // Array zum Speichern der Aufgaben
let bearbeitungsIndex = -1; // Index der aktuell bearbeiteten Aufgabe, -1 bedeutet keine Bearbeitung

// Formularvalidierung
function formValidieren() {
    // Trimme Leerzeichen am Anfang und Ende der Eingaben
    let titel = document.getElementById('titel').value.trim();
    let beschreibung = document.getElementById('beschreibung').value.trim();
    let autor = document.getElementById('autor').value.trim();
    let startDatum = document.getElementById('startDatum').value;
    let endDatum = document.getElementById('endDatum').value;
    let fehlermeldung = document.getElementById('fehlermeldung');

    // Überprüft, ob alle Felder ausgefüllt sind
    if (titel.length === 0 || beschreibung.length === 0 || autor.length === 0 || startDatum.length === 0 || endDatum.length === 0) {
        fehlermeldung.textContent = 'Alle Felder müssen ausgefüllt sein!';
        return false;
    }

    // Überprüft, ob die maximale Länge der Felder überschritten ist
    if (titel.length > 255 || beschreibung.length > 255 || autor.length > 20) {
        fehlermeldung.textContent = 'Ein oder mehrere Felder überschreiten die maximale Länge!';
        return false;
    }

    // Überprüft, ob das Enddatum nach dem Startdatum liegt
    if (new Date(startDatum) > new Date(endDatum)) {
        fehlermeldung.textContent = 'Das Enddatum muss nach dem Startdatum liegen!';
        return false;
    }

    fehlermeldung.textContent = '';
    return true;
}

// Formularvalidierung für das Bearbeitungsformular
function bearbeitungsFormValidieren() {
    // Trimme Leerzeichen am Anfang und Ende der Eingaben
    let titel = document.getElementById('editTitel').value.trim();
    let beschreibung = document.getElementById('editBeschreibung').value.trim();
    let autor = document.getElementById('editAutor').value.trim();
    let startDatum = document.getElementById('editStartDatum').value;
    let endDatum = document.getElementById('editEndDatum').value;
    let fehlermeldung = document.getElementById('bearbeitenFehlermeldung');

    // Überprüft, ob alle Felder ausgefüllt sind
    if (titel.length === 0 || beschreibung.length === 0 || autor.length === 0 || startDatum.length === 0 || endDatum.length === 0) {
        fehlermeldung.textContent = 'Alle Felder müssen ausgefüllt sein!';
        return false;
    }

    // Überprüft, ob die maximale Länge der Felder überschritten ist
    if (titel.length > 255 || beschreibung.length > 255 || autor.length > 20) {
        fehlermeldung.textContent = 'Ein oder mehrere Felder überschreiten die maximale Länge!';
        return false;
    }

    // Überprüft, ob das Enddatum nach dem Startdatum liegt
    if (new Date(startDatum) > new Date(endDatum)) {
        fehlermeldung.textContent = 'Das Enddatum muss nach dem Startdatum liegen!';
        return false;
    }

    fehlermeldung.textContent = '';
    return true;
}

// Priorität berechnen
function berechnePrioritaet(wichtig, dringend) {
    if (wichtig && dringend) return 'Sofort erledigen';
    if (wichtig && !dringend) return 'Einplanen und Wohlfühlen';
    if (!wichtig && dringend) return 'Gib es ab';
    return 'Weg damit';
}

// Neue Aufgabe hinzufügen
function aufgabeHinzufuegen() {
    const aufgabe = {
        titel: document.getElementById('titel').value.trim(),
        beschreibung: document.getElementById('beschreibung').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        kategorie: document.getElementById('kategorie').value,
        wichtig: document.getElementById('wichtig').checked,
        dringend: document.getElementById('dringend').checked,
        startDatum: document.getElementById('startDatum').value,
        endDatum: document.getElementById('endDatum').value,
        fortschritt: document.getElementById('fortschritt').value,
        prioritaet: berechnePrioritaet(document.getElementById('wichtig').checked, document.getElementById('dringend').checked)
    };

    aufgaben.push(aufgabe); // Fügt die neue Aufgabe in das Array ein
    aufgabenSortieren(); // Sortiert die Aufgaben nach Priorität
    aufgabenAnzeigen(); // Zeigt alle Aufgaben an
    formularLeeren(); // Leert das Formular
}

// Aufgaben nach Priorität sortieren
function aufgabenSortieren() {
    aufgaben.sort((a, b) => {
        const prioritaetReihenfolge = ['Sofort erledigen', 'Einplanen und Wohlfühlen', 'Gib es ab', 'Weg damit'];
        return prioritaetReihenfolge.indexOf(a.prioritaet) - prioritaetReihenfolge.indexOf(b.prioritaet);
    });
}

// Aufgaben anzeigen
function aufgabenAnzeigen() {
    const container = document.getElementById('aufgabenContainer');
    container.innerHTML = ''; // Leert den Container

    // Geht durch alle Aufgaben und fügt sie dem Container hinzu
    aufgaben.forEach((aufgabe, index) => {
        const aufgabeElement = document.createElement('div');
        aufgabeElement.classList.add('aufgabe');
        let prioritaetHTML = `<span class="bold">Priorität:</span> ${aufgabe.prioritaet}`;

        // Überprüft die Priorität und fügt die entsprechende Highlight-Klasse hinzu
        if (aufgabe.prioritaet === 'Sofort erledigen') {
            prioritaetHTML = `<span class="bold highlight-sofort">${aufgabe.prioritaet}</span>`;
        } else if (aufgabe.prioritaet === 'Einplanen und Wohlfühlen') {
            prioritaetHTML = `<span class="bold highlight-einplanen">${aufgabe.prioritaet}</span>`;
        } else if (aufgabe.prioritaet === 'Gib es ab') {
            prioritaetHTML = `<span class="bold highlight-gibab">${aufgabe.prioritaet}</span>`;
        } else if (aufgabe.prioritaet === 'Weg damit') {
            prioritaetHTML = `<span class="bold highlight-weg">${aufgabe.prioritaet}</span>`;
        }

        // Baut das HTML für die Aufgabe
        aufgabeElement.innerHTML = `
            <h3>${aufgabe.titel}</h3>
            <p>${prioritaetHTML}</p>
            <p><span class="bold">Enddatum:</span> ${aufgabe.endDatum}</p>
            <p><span class="bold">Fortschritt:</span> ${aufgabe.fortschritt}%</p>
            <div class="erweitert-content" style="display: none;">
                <p><span class="bold">Autor:</span> ${aufgabe.autor}</p>
                <p><span class="bold">Kategorie:</span> ${aufgabe.kategorie}</p>
                <p><span class="bold">Startdatum:</span> ${aufgabe.startDatum}</p>
                <p><span class="bold">Beschreibung:</span> <span class="beschreibung">${aufgabe.beschreibung}</span></p>
                <button class="abschliessen" onclick="bestaetigenAbschliessen(${index})">Abschliessen</button>
                <button class="bearbeiten" onclick="aufgabeBearbeiten(${index})">Bearbeiten</button>
                <button class="loeschen" onclick="bestaetigenLoeschen(${index})">Löschen</button>
            </div>
        `;

        // Fügt einen Click-Event-Listener hinzu, um die Aufgabe zu erweitern
        aufgabeElement.addEventListener('click', function () {
            document.querySelectorAll('.aufgabe.erweitert').forEach(elem => {
                if (elem !== this) {
                    elem.classList.remove('erweitert');
                    elem.querySelector('.erweitert-content').style.display = 'none';
                }
            });
            this.classList.toggle('erweitert');
            const content = this.querySelector('.erweitert-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        // Fügt das Aufgabelement dem Container hinzu
        container.appendChild(aufgabeElement);
    });
}

// Formular leeren
function formularLeeren() {
    document.getElementById('todoForm').reset(); // Setzt das Formular zurück
    document.getElementById('fortschrittWert').textContent = '0%'; // Setzt den Fortschrittswert auf 0%
}

// Aufgaben suchen
function aufgabenSuchen(query) {
    const gefilterteAufgaben = aufgaben.filter(aufgabe => aufgabe.titel.toLowerCase().includes(query.toLowerCase())); // Filtert Aufgaben nach dem Suchbegriff
    const container = document.getElementById('aufgabenContainer');
    container.innerHTML = ''; // Leert den Container

    // Geht durch die gefilterten Aufgaben und fügt sie dem Container hinzu
    gefilterteAufgaben.forEach((aufgabe, index) => {
        const aufgabeElement = document.createElement('div');
        aufgabeElement.classList.add('aufgabe');
        let prioritaetHTML = `<span class="bold">Priorität:</span> ${aufgabe.prioritaet}`;

        // Überprüft die Priorität und fügt die entsprechende Highlight-Klasse hinzu
        if (aufgabe.prioritaet === 'Sofort erledigen') {
            prioritaetHTML = `<span class="bold highlight-sofort">Priorität:</span> ${aufgabe.prioritaet}`;
        } else if (aufgabe.prioritaet === 'Einplanen und Wohlfühlen') {
            prioritaetHTML = `<span class="bold highlight-einplanen">Priorität:</span> ${aufgabe.prioritaet}`;
        } else if (aufgabe.prioritaet === 'Gib es ab') {
            prioritaetHTML = `<span class="bold highlight-gibab">Priorität:</span> ${aufgabe.prioritaet}`;
        } else if (aufgabe.prioritaet === 'Weg damit') {
            prioritaetHTML = `<span class="bold highlight-weg">Priorität:</span> ${aufgabe.prioritaet}`;
        }

        // Baut das HTML für die gefilterte Aufgabe
        aufgabeElement.innerHTML = `
            <h3>${aufgabe.titel}</h3>
            <p>${prioritaetHTML}</p>
            <p><span class="bold">Enddatum:</span> ${aufgabe.endDatum}</p>
            <p><span class="bold">Fortschritt:</span> ${aufgabe.fortschritt}%</p>
            <div class="erweitert-content" style="display: none;">
                <p><span class="bold">Autor:</span> ${aufgabe.autor}</p>
                <p><span class="bold">Kategorie:</span> ${aufgabe.kategorie}</p>
                <p><span class="bold">Startdatum:</span> ${aufgabe.startDatum}</p>
                <p><span class="bold">Beschreibung:</span> <span class="beschreibung">${aufgabe.beschreibung}</span></p>
                <button class="abschliessen" onclick="bestaetigenAbschliessen(${index})">Abschliessen</button>
                <button class="bearbeiten" onclick="aufgabeBearbeiten(${index})">Bearbeiten</button>
                <button class="loeschen" onclick="bestaetigenLoeschen(${index})">Löschen</button>
            </div>
        `;

        // Fügt einen Click-Event-Listener hinzu, um die Aufgabe zu erweitern
        aufgabeElement.addEventListener('click', function () {
            document.querySelectorAll('.aufgabe.erweitert').forEach(elem => {
                if (elem !== this) {
                    elem.classList.remove('erweitert');
                    elem.querySelector('.erweitert-content').style.display = 'none';
                }
            });
            this.classList.toggle('erweitert');
            const content = this.querySelector('.erweitert-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        // Fügt das Aufgabelement dem Container hinzu
        container.appendChild(aufgabeElement);
    });
}

// Aufgabe bearbeiten
function aufgabeBearbeiten(index) {
    bearbeitungsIndex = index; // Setzt den Bearbeitungsindex auf die aktuelle Aufgabe
    const aufgabe = aufgaben[index];
    document.getElementById('editTitel').value = aufgabe.titel.trim();
    document.getElementById('editBeschreibung').value = aufgabe.beschreibung.trim();
    document.getElementById('editAutor').value = aufgabe.autor.trim();
    document.getElementById('editKategorie').value = aufgabe.kategorie;
    document.getElementById('editWichtig').checked = aufgabe.wichtig;
    document.getElementById('editDringend').checked = aufgabe.dringend;
    document.getElementById('editStartDatum').value = aufgabe.startDatum;
    document.getElementById('editEndDatum').value = aufgabe.endDatum;
    document.getElementById('editFortschritt').value = aufgabe.fortschritt;
    document.getElementById('editFortschrittWert').textContent = aufgabe.fortschritt + '%';
    document.getElementById('bearbeitenPopup').classList.add('open'); // Öffnet das Bearbeiten-Popup
}

// Event Listener für das Bearbeitungsformular, das das Formular validiert und die Aufgabe speichert
document.getElementById('bearbeitenFormular').addEventListener('submit', function (e) {
    e.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seitenneuladen)
    if (bearbeitungsFormValidieren()) {
        aufgabeSpeichern(); 
    }
});

// Aufgabe speichern
function aufgabeSpeichern() {
    const aufgabe = aufgaben[bearbeitungsIndex]; // Holt die aktuelle Aufgabe
    aufgabe.titel = document.getElementById('editTitel').value.trim();
    aufgabe.beschreibung = document.getElementById('editBeschreibung').value.trim();
    aufgabe.autor = document.getElementById('editAutor').value.trim();
    aufgabe.kategorie = document.getElementById('editKategorie').value;
    aufgabe.wichtig = document.getElementById('editWichtig').checked;
    aufgabe.dringend = document.getElementById('editDringend').checked;
    aufgabe.startDatum = document.getElementById('editStartDatum').value;
    aufgabe.endDatum = document.getElementById('editEndDatum').value;
    aufgabe.fortschritt = document.getElementById('editFortschritt').value;
    aufgabe.prioritaet = berechnePrioritaet(document.getElementById('editWichtig').checked, document.getElementById('editDringend').checked); // Berechnet die Priorität basierend auf den Checkboxen
    aufgabenSortieren(); 
    aufgabenAnzeigen(); 
    schliessenBearbeitenPopup(); 
}

// Bearbeiten-Popup schließen
function schliessenBearbeitenPopup() {
    document.getElementById('bearbeitenPopup').classList.remove('open');
}

// Aufgabe abschließen bestätigen
function bestaetigenAbschliessen(index) {
    if (confirm('Möchten Sie diese Aufgabe wirklich abschliessen?')) {
        aufgaben.splice(index, 1); // Entfernt die Aufgabe aus dem Array
        aufgabenAnzeigen(); 
    }
}

// Aufgabe löschen bestätigen
function bestaetigenLoeschen(index) {
    if (confirm('Möchten Sie diese Aufgabe wirklich löschen?')) {
        aufgaben.splice(index, 1);
        aufgabenAnzeigen(); 
    }
}
