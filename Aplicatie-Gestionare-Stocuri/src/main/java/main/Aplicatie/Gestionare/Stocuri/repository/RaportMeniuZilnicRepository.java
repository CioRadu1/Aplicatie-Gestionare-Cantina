package main.Aplicatie.Gestionare.Stocuri.repository;

import main.Aplicatie.Gestionare.Stocuri.model.RaportMeniuZilnic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RaportMeniuZilnicRepository extends JpaRepository<RaportMeniuZilnic, String> {

}
