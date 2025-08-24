package main.Aplicatie.Gestionare.Stocuri.service;

import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazie;
import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazieKey;
import main.Aplicatie.Gestionare.Stocuri.repository.IntrariMagazieRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class IntrariMagazieService {

    private final IntrariMagazieRepository intrariMagazieRepository;

    public IntrariMagazieService(IntrariMagazieRepository intrariMagazieRepository) {
        this.intrariMagazieRepository = intrariMagazieRepository;
    }

    public IntrariMagazie addIntrareMagazie(IntrariMagazie intrare) {
        return intrariMagazieRepository.save(intrare);
    }

    public List<IntrariMagazie> findAllIntrari() {
        return intrariMagazieRepository.findAll();
    }

    public Optional<IntrariMagazie> findById(IntrariMagazieKey id) {
        return intrariMagazieRepository.findById(id);
    }

    public void deleteById(IntrariMagazieKey id) {
        intrariMagazieRepository.deleteById(id);
    }

    public List<IntrariMagazie> findByCodIngredient(String codIngredient, LocalDate date) {
        return intrariMagazieRepository.findById_CodIngredientAndId_DataAchizitie(codIngredient,date);
    }
}