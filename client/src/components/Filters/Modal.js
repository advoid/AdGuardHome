import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { Trans, withNamespaces } from 'react-i18next';

import { MODAL_TYPE } from '../../helpers/constants';
import Form from './Form';
import '../ui/Modal.css';

const filtersCatalog = require('./filters.json');

ReactModal.setAppElement('#root');

class Modal extends Component {
    closeModal = () => {
        this.props.toggleFilteringModal();
    };

    render() {
        const {
            isOpen,
            processingAddFilter,
            processingConfigFilter,
            handleSubmit,
            modalType,
            currentFilterData,
            whitelist,
            toggleFilteringModal,
            filters,
        } = this.props;

        const newListTitle = whitelist ? <Trans>new_allowlist</Trans>
            : <Trans>new_blocklist</Trans>;

        const editListTitle = whitelist ? <Trans>edit_allowlist</Trans>
            : <Trans>edit_blocklist</Trans>;

        const normalizedFilters = filters.reduce((acc, { enabled, url }) => {
            acc[url] = enabled;
            return acc;
        }, {});

        const sources = Object.values(filtersCatalog)
            .flatMap(el => Object.values(el)).map(el => el.source);

        const initialValuesCatalog = sources.reduce((acc, source) => {
            if (Object.prototype.hasOwnProperty.call(normalizedFilters, source)) {
                acc[btoa(source)] = true;
            }
            return acc;
        }, {});

        const initialValues = modalType === MODAL_TYPE.EDIT_FILTERS ?
            currentFilterData : initialValuesCatalog;

        return (
            <ReactModal
                className="Modal__Bootstrap modal-dialog modal-dialog-centered"
                closeTimeoutMS={0}
                isOpen={isOpen}
                onRequestClose={this.closeModal}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">
                            {modalType === MODAL_TYPE.EDIT_FILTERS && editListTitle}
                            {modalType === MODAL_TYPE.ADD_FILTERS && newListTitle}
                            {modalType === MODAL_TYPE.CHOOSE_FILTERING_LIST
                            && <Trans>choose_blocklists</Trans>}
                        </h4>
                        <button type="button" className="close" onClick={this.closeModal}>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <Form
                        modalType={modalType}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        processingAddFilter={processingAddFilter}
                        processingConfigFilter={processingConfigFilter}
                        closeModal={this.closeModal}
                        whitelist={whitelist}
                        toggleFilteringModal={toggleFilteringModal}
                        filters={filters}
                    />
                </div>
            </ReactModal>
        );
    }
}

Modal.propTypes = {
    toggleFilteringModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    addFilter: PropTypes.func.isRequired,
    isFilterAdded: PropTypes.bool.isRequired,
    processingAddFilter: PropTypes.bool.isRequired,
    processingConfigFilter: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    modalType: PropTypes.string.isRequired,
    currentFilterData: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    whitelist: PropTypes.bool,
    filters: PropTypes.array.isRequired,
};

export default withNamespaces()(Modal);
