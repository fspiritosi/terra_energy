describe('Tipos de Inspección - CRUD', () => {
  const path = '/dashboard/inspecciones/tipos_de_inspeccion';

  const unique = Date.now();
  const nombre = `tipo test ${unique}`;
  const codigo = `test-${unique}`;
  const descripcion = `descripcion test ${unique}`;
  const nombreEditado = `${nombre} editado`;

  before(() => {
    cy.login();
  });

  it('C - Crear un nuevo tipo de inspección', () => {
    cy.visit(path);

    // Abrir modal de creación
    cy.get('[data-testid="add-type-inspeccion"]').click();

    // Completar formulario
    cy.get('[data-testid="tipo-inspeccion-form"]').should('be.visible');
    cy.get('[data-testid="input-nombre"]').type(nombre);
    cy.get('[data-testid="input-codigo"]').type(codigo);
    cy.get('[data-testid="input-descripcion"]').type(descripcion);

    // Guardar
    cy.get('[data-testid="btn-guardar"]').click();

    // Verificar presencia en tabla (puede tardar por revalidatePath)
    cy.contains('table tr', nombre, { timeout: 10000 }).should('exist');
  });

  it('R - Buscar y leer el tipo creado', () => {
    cy.visit(path);

    // Usar el buscador global por placeholder
    cy.get('input[placeholder="Buscar por nombre, codigo o descripcion..."]').clear().type(nombre);
    cy.contains('table tr', nombre).should('exist');
  });

  it('U - Editar el tipo creado', () => {
    cy.visit(path);

    // Ubicar la fila del item y abrir acciones -> Editar
    cy.contains('table tr', nombre).within(() => {
      cy.get('[data-testid="row-actions-trigger"]').click();
    });
    cy.get('[data-testid="edit-type-inspeccion"]').click();

    // Editar nombre y estado
    cy.get('[data-testid="tipo-inspeccion-form"]').should('be.visible');
    cy.get('[data-testid="input-nombre"]').clear().type(nombreEditado);
    cy.get('[data-testid="switch-activo"]').click({ force: true });

    // Guardar
    cy.get('[data-testid="btn-guardar"]').click();

    // Verificar fila actualizada
    cy.contains('table tr', nombreEditado, { timeout: 10000 }).should('exist');
  });

  // No tenemos un endpoint para eliminar tipos de inspección
  // por lo que no se puede probar la eliminación
  it.skip('D - Eliminar el tipo creado', () => {
    cy.visit(path);

    // Abrir menú de acciones y eliminar
    cy.contains('table tr', nombreEditado).within(() => {
      cy.get('[data-testid="row-actions-trigger"]').click();
    });
    cy.get('[data-testid="delete-type-inspeccion"]').click();
    cy.get('[data-testid="confirm-delete-type-inspeccion"]').click();

    // Verificar que ya no exista
    cy.contains('table tr', nombreEditado, { timeout: 10000 }).should('not.exist');
  });
});
