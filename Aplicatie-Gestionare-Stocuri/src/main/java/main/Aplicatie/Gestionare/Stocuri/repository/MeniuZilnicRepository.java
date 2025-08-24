package main.Aplicatie.Gestionare.Stocuri.repository;

import main.Aplicatie.Gestionare.Stocuri.model.MeniuZilnic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeniuZilnicRepository extends JpaRepository<MeniuZilnic, String> {
    List<MeniuZilnic> findByNumeRetetaContainingIgnoreCase(String numeReteta);
    Optional<MeniuZilnic> findById(String codArticol);
}