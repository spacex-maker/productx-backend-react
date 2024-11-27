import styled from 'styled-components';

export const EmptyStateWrapper = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6c757d;

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-text {
    margin-bottom: 0.5rem;
  }

  .action-links {
    button {
      padding: 0;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`; 