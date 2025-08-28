package main.Aplicatie.Gestionare.Stocuri.repository;

import main.Aplicatie.Gestionare.Stocuri.model.IntrariMagazie;
import main.Aplicatie.Gestionare.Stocuri.model.RaportMeniuZilnic;
import main.Aplicatie.Gestionare.Stocuri.model.RaportMeniuZilnicKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RaportMeniuZilnicRepository extends JpaRepository<RaportMeniuZilnic, RaportMeniuZilnicKey> {

    List<IntrariMagazie> findById_CodArticolOrderById_DataDeProducere(String idCodArticol);

    void deleteById_CodArticol(String codAtricol);

}
