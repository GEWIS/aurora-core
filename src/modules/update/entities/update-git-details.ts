import { Column } from 'typeorm';

export default class UpdateGitDetails {
  /**
   * The URL to the git repository of this subscribe entity. Used to fetch most recent version.
   */
  @Column({ nullable: true })
  public gitRepositoryUrl?: string;

  /**
   * The last version the client has authenticated with.
   */
  @Column({ nullable: true })
  public lastSeenVersion?: string;

  updateValues(params: { gitRepositoryUrl?: string; currentVersion?: string }) {
    this.gitRepositoryUrl = params.gitRepositoryUrl;
    this.lastSeenVersion = params.currentVersion;
  }
}
