package gr.hua.dit.ds.crowdfunding.repository;

import gr.hua.dit.ds.crowdfunding.entity.Project;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path= "project")
@Hidden
public interface ProjectRepository extends JpaRepository<Project, Integer> {

    Optional<Project> findByName(String name);
}
