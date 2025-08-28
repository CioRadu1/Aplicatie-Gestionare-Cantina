package main.Aplicatie.Gestionare.Stocuri.service;


import main.Aplicatie.Gestionare.Stocuri.model.*;
import main.Aplicatie.Gestionare.Stocuri.repository.MateriePrimaRepository;
import main.Aplicatie.Gestionare.Stocuri.repository.RaportMeniuZilnicRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
public class RaportMeniuZilnicService {

    private final RaportMeniuZilnicRepository raportMeniuZilnicRepository;

    public RaportMeniuZilnicService(RaportMeniuZilnicRepository raportMeniuZilnicRepository) {
        this.raportMeniuZilnicRepository = raportMeniuZilnicRepository;
    }
    public Optional<RaportMeniuZilnic> updatePret(RaportMeniuZilnicKey id, BigDecimal pretNou) {
        Optional<RaportMeniuZilnic> optionalRaportMeniuZilnic = raportMeniuZilnicRepository.findById(id);
        if (optionalRaportMeniuZilnic.isPresent()) {
            RaportMeniuZilnic meniuZilnic = optionalRaportMeniuZilnic.get();
            meniuZilnic.setPretStandard(pretNou);
            return Optional.of(raportMeniuZilnicRepository.save(meniuZilnic));
        } else {
            return Optional.empty();
        }
    }
    public Optional<RaportMeniuZilnic> findById(RaportMeniuZilnicKey intrare) {
        return raportMeniuZilnicRepository.findById(intrare);
    }

    public List<RaportMeniuZilnic> findAllRaportMeniuZilnic() {
        return raportMeniuZilnicRepository.findAll();
    }
    public RaportMeniuZilnic addRaportMeniuZilnic(RaportMeniuZilnic raportMeniuZilnic) {
        return raportMeniuZilnicRepository.save(raportMeniuZilnic);
    }
    public List<IntrariMagazie> findByCodArticolToDelete(String codIngredient) {
        return raportMeniuZilnicRepository.findById_CodArticolOrderById_DataDeProducere(codIngredient);
    }
    public void deleteRaportMeniuZilnic(String codAtricol) {
        raportMeniuZilnicRepository.deleteById_CodArticol(codAtricol);
    }

}

