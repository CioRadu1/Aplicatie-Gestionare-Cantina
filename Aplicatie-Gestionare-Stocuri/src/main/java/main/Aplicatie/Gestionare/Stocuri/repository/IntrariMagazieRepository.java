package main.Aplicatie.Gestionare.Stocuri.repository;

import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazie;
import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazieKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IntrariMagazieRepository extends JpaRepository<IntrariMagazie, IntrariMagazieKey> {
    List<IntrariMagazie> findById_CodIngredientAndId_DataAchizitie(String codIngredient, LocalDate dataAchizitie);
    List<IntrariMagazie> findById_CodIngredientOrderById_DataAchizitieAsc(String codIngredient);
}