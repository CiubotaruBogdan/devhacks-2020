-- Crearea bazei de date
CREATE DATABASE devhacks

-- Crearea tabelului cu copii
CREATE TABLE `devhacks`.`children`(
    `id` INT NOT NULL AUTO_INCREMENT, -- ID unic
    `name` TEXT NOT NULL, -- Numele complet
    `latitude` DECIMAL(12, 8) NOT NULL, -- Latitudinea domiciuliului
    `longitude` DECIMAL(12, 8) NOT NULL, -- Longitudinea domiciuliului
    `lessons_count` INT NOT NULL, -- Numarul de lectii la care a participat
    `disconnects_per_lesson` INT NOT NULL, -- Numarul de deconectari
    `missed_lessons` INT NOT NULL, -- Numarul de lectii la care nu a participat
    `failures_count` INT NOT NULL, -- Numarul de defectiuni ale echipamentului
    `needs` TEXT NOT NULL, -- Serializare a ID-urilor nevoilor pe care le are
    `family_status` INT NOT NULL, -- Situatia familiei
    `abandonment_degree` INT NOT NULL, -- Grad de abandon, calculat in functie de celalte metrici
    PRIMARY KEY (`id`)
);

-- Crearea tabelului cu donatori
CREATE TABLE `devhacks`.`donors`(
    `id` INT NOT NULL AUTO_INCREMENT, -- ID unic
    `name` TEXT NOT NULL, -- Nume complet
    `donation_amount` INT NOT NULL, -- Echivalentul in valuta al donatiei
    `child_id` INT NOT NULL,  -- ID-ul copilului pentru care s-a donat
    PRIMARY KEY (`id`)
);