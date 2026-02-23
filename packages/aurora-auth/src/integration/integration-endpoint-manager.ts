export default class IntegrationEndpointManager {
  private static instance: IntegrationEndpointManager;

  private integrationMethods: string[] = [];

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new IntegrationEndpointManager();
    }
    return this.instance;
  }

  public addIntegrationMethod(methodName: string): void {
    this.integrationMethods.push(methodName);
  }

  public getIntegrationMethods(): string[] {
    return this.integrationMethods;
  }
}
