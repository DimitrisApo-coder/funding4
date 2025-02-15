package gr.hua.dit.ds.crowdfunding.rest;

import gr.hua.dit.ds.crowdfunding.dao.ProjectDAO;
import gr.hua.dit.ds.crowdfunding.entity.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
public class ProjectRestController {

    @Autowired
    private ProjectDAO projectDao;

    @GetMapping("")
    public List<Project> getProjects() {
        return projectDao.getProjects();
    }

    @GetMapping("/{id}")
    public Project getProject(@PathVariable Integer id) {
        Project project = projectDao.getProject(id);
        if (project == null) {
            throw new RuntimeException("Project with id " + id + " not found");
        }
        return project;
    }

    @PostMapping("")
    public Project saveProject(@RequestBody Project project) {
        return projectDao.saveProject(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Integer id, @RequestBody Project project) {
        Project existingProject = projectDao.getProject(id);
        if (existingProject == null) {
            throw new RuntimeException("Project with id " + id + " not found");
        }
        project.setId(id);  // Ensure the ID matches the path variable
        return projectDao.saveProject(project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Integer id) {
        Project existingProject = projectDao.getProject(id);
        if (existingProject == null) {
            throw new RuntimeException("Project with id " + id + " not found");
        }
        projectDao.deleteProject(id);
    }
}
