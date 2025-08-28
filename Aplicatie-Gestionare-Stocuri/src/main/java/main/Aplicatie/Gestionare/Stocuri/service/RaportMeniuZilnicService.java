package main.Aplicatie.Gestionare.Stocuri.service;


import main.Aplicatie.Gestionare.Stocuri.model.MateriePrima;
import main.Aplicatie.Gestionare.Stocuri.model.RaportMeniuZilnic;
import main.Aplicatie.Gestionare.Stocuri.repository.MateriePrimaRepository;
import main.Aplicatie.Gestionare.Stocuri.repository.RaportMeniuZilnicRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class RaportMeniuZilnicService {

    private final RaportMeniuZilnicRepository raportMeniuZilnicRepository;

    public RaportMeniuZilnicService(RaportMeniuZilnicRepository raportMeniuZilnicRepository) {
        this.raportMeniuZilnicRepository = raportMeniuZilnicRepository;
    }


    public List<RaportMeniuZilnic> findAllRaportMeniuZilnic() {
        return raportMeniuZilnicRepository.findAll();
    }
    public RaportMeniuZilnic addRaportMeniuZilnic(RaportMeniuZilnic raportMeniuZilnic) {
        return raportMeniuZilnicRepository.save(raportMeniuZilnic);
    }

}

