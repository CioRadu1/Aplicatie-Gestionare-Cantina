package main.Aplicatie.Gestionare.Stocuri.service;

import main.Aplicatie.Gestionare.Stocuri.model.ExecutieReteta;
import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazie;
import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazieKey;
import main.Aplicatie.Gestionare.Stocuri.repository.IntrariMagazieRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
    public List<IntrariMagazie> findByCodArticol(String codIngredient) {
        return intrariMagazieRepository.findById_CodIngredientOrderById_DataAchizitieAsc(codIngredient);
    }
    public Optional<IntrariMagazie> updateFolosita(String codArticol, LocalDate data,  BigDecimal folositNew) {
        List<IntrariMagazie> intrari = intrariMagazieRepository.findById_CodIngredientAndId_DataAchizitie(codArticol, data);
        if (!intrari.isEmpty()) {
            IntrariMagazie executie = intrari.get(0);
            executie.setCantitateFolosita(folositNew);
            return Optional.of(intrariMagazieRepository.save(executie));
        } else {
            return Optional.empty();
        }
    }
}