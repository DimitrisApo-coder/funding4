package gr.hua.dit.ds.crowdfunding.dao;

import gr.hua.dit.ds.crowdfunding.entity.Project;

import java.util.List;


public interface ProjectDAO {

    public List<Project> getProjects();
    public Project getProject(Integer project_id);
    public Project saveProject(Project project);
    public void deleteProject(Integer project_id);

}
